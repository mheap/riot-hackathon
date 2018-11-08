using System;
using System.IO;
using Rofl.Parser;
using System.Linq;
using Newtonsoft.Json;

namespace RoflHelper
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if(args.Length != 1)
            {
                Console.WriteLine("1:invalid argument(s)");
                Environment.Exit(1);
            }
            
            if(!File.Exists(args[0]))
            {
                Console.WriteLine("2:file does not exist");
                Environment.Exit(2);
            }

            try
            {
                var readTask = ReplayReader.ReadReplayFileAsync(args[0]).Result;

                ReturnData readData = new ReturnData() { MatchId = readTask.MatchHeader.MatchId };
                readData.Players = readTask.MatchMetadata.Players.Select(x => new PlayerData((string)x["NAME"], (string)x["SKIN"], (ulong)x["ID"])).ToArray();

                Console.WriteLine(JsonConvert.SerializeObject(readData));
            }
            catch (Exception ex)
            {
                Console.WriteLine("3:exception - " + ex.Message + ex.StackTrace);
                Environment.Exit(3);
            }
        }
    }

    class ReturnData
    {
        public ulong MatchId { get; set; }
        public PlayerData[] Players { get; set; } 
    }

    class PlayerData
    {
        public string Username { get; set; }
        public string Champion { get; set; }
        public ulong UserId { get; set; }

        public PlayerData(string name, string champ, ulong id)
        {
            Username = name;
            Champion = champ;
            UserId = id;
        }
    }
}