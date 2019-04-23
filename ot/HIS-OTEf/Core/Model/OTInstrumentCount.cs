using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace OTEf.Core.Model
{
    public class OTInstrumentCount
    {
        public int Id { get; set; }
        public int OTInstrumentId { get; set; }
        public int InitialCount { get; set; }
        public int SecondCount { get; set; } 
        public int FinalCount { get; set; }

        public virtual OTInstrument Instrument { get; set; }
        [JsonIgnore]
        public virtual OTRoomCountSheet OTRoomCountSheet { set; get; }
        public virtual int? OTRoomCountSheetId { get; set; }
    }
}
