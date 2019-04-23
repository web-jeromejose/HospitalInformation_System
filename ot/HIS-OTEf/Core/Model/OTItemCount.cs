using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class OTItemCount
    {

        public int Id                       { get; set; }
        public int OTUnitOfMeasurementId    { get; set; }
        public int OTItemId                 { get; set; }
        public int FirstCount               { get; set; }
        public int SecondCount              { get; set; }
        public int ThirdCount               { get; set; }
        public int FirstAddition            { get; set; }
        public int SecondAddition            { get; set; }
        public int ThirdAddition             { get; set; }
        public int FinalCount                { get; set; }

        
        public virtual OTUnitOfMeasurement Unit { get; set; }
        public virtual OTItem Item { get; set; }

        //Ignore Self referecing Use JSON.net Newtonsoft json in serializing to object to json
        [JsonIgnore]
        public virtual OTRoomCountSheet OTRoomCountSheet { set; get; }

        public virtual int? OTRoomCountSheetId { get; set; }
    }
}
