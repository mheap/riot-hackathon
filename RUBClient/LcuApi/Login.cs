using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LcuApi
{
    public class Login
    {
        public class SessionDto
        {
            public int AccountId { get; set; }
            public bool Connected { get; set; }
            public int SummonerId { get; set; }
            public string Username { get; set; }
        }

        private readonly HttpClient _client;

        internal Login(HttpClient client)
        {
            this._client = client;
        }

        public async Task<SessionDto> GetSession()
        {
            var res = await this._client.GetAsync("lol-login/v1/session");

            return JsonConvert.DeserializeObject<SessionDto>(await res.Content.ReadAsStringAsync());
        }
    }
}
