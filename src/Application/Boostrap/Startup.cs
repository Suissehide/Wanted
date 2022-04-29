using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using System.Text;
using System.Web;
using Wanted.Application;
using Wanted.Application.Registration;
using Wanted.Hubs;

namespace Wanted.Boostrap
{
    public class Startup
    {
        #region Fields

        private readonly IConfiguration _configuration;
        private readonly IHostEnvironment _environment;

        #endregion
        static long GuestId = 0;

        public Startup(IHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.AddSignalR()
                .AddJsonProtocol(options => {
                    options.PayloadSerializerOptions.PropertyNamingPolicy = null;
                });
                //.AddNewtonsoftJsonProtocol();
                //.withHubProtocol(new signalR.JsonHubProtocol());

            services.AddSingleton<Game>();
            services.AddAuthentication().AddCookie();
            services.AddDataProtection();
        }

        public void Configure(IApplicationBuilder app)
        {
            IDataProtectionProvider provider = app.ApplicationServices.GetDataProtectionProvider();
            Game game = app.ApplicationServices.GetService<Game>() ?? throw new ArgumentException("Error build game class");

            if (_environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseFileServer();

            app.UseRouting();
            app.UseAuthentication();

            app.Use((context, next) =>
            {
                var state = context.Request.Cookies["wanted.state"];

                if (state != null)
                {
                    try
                    {
                        string decoded = HttpUtility.UrlDecode(state);
                        var rc = JsonConvert.DeserializeObject<RegisteredClient>(decoded);

                        if (rc.Identity == "Guest")
                        {
                            rc.DisplayName = "Guest" + Interlocked.Increment(ref GuestId);
                            rc.Identity = "Guest" + Guid.NewGuid().ToString();
                            rc.RegistrationId = null;
                        }
                        else
                        {
                            Byte[] encryptedIdentity = WebEncoders.Base64UrlDecode(rc.Identity);
                            var unprotectedIdentity = provider.CreateProtector("Wanted.Identity").Unprotect(encryptedIdentity);
                            rc.Identity = Encoding.UTF8.GetString(unprotectedIdentity);
                        }

                        rc.DisplayName = System.Net.WebUtility.HtmlEncode(rc.DisplayName);

                        game.RegistrationHandler.Register(rc);

                        SetState(rc, context, provider);
                    }
                    catch
                    {
                    }
                }
                else
                {
                    //hack
                    var rc = new RegisteredClient(null, "Guest" + Guid.NewGuid().ToString(),
                        System.Net.WebUtility.HtmlEncode("Guest" + Interlocked.Increment(ref GuestId)));
                    game.RegistrationHandler.Register(rc);

                    SetState(rc, context, provider);
                }

                return next();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<MainHub>("/hub");
            });
        }

        public static void SetState(RegisteredClient rc, HttpContext context, IDataProtectionProvider provider)
        {
            // Save the cookie state
            Byte[] identity = Encoding.UTF8.GetBytes(rc.Identity);
            Byte[] encrypted = provider.CreateProtector("Wanted.Identity").Protect(identity);
            var temp = new RegisteredClient(rc.RegistrationId, WebEncoders.Base64UrlEncode(encrypted), rc.DisplayName);
            var state = JsonConvert.SerializeObject(temp);

            context.Response.Cookies.Append("wanted.state", state, new CookieOptions
            {
                Expires = DateTime.Now.AddDays(30)
            });
        }
    }
}
