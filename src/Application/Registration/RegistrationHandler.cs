﻿using System.Collections.Concurrent;

namespace Wanted.Application.Registration
{
    public class RegistrationHandler
    {
        private readonly ConcurrentDictionary<string, RegisteredClient> _registrationList = new ConcurrentDictionary<string, RegisteredClient>();

        public bool RegistrationExists(string registrationId)
        {
            return _registrationList.ContainsKey(registrationId);
        }

        public RegisteredClient? RemoveRegistration(string registrationId)
        {
            _registrationList.TryRemove(registrationId, out var rc);

            return rc;
        }

        public RegisteredClient Register(RegisteredClient existing)
        {
            existing.RegistrationId = Guid.NewGuid().ToString();
            _registrationList.TryAdd(existing.RegistrationId, existing);
            System.Diagnostics.Debug.WriteLine("REGISTER: ", existing);
            return existing;
        }
    }
}
