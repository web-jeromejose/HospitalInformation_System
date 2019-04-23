using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class ConsciousSedationRecord : PatientCommon
    {
        public int Id { get; set; }
        public int? PreSedationId { get; set; }
        public int? SedationMonitoringId { get; set; }
        public int? SedationRecoveryRoomRecordId { get; set; }
        public int Age { get; set; }
        public int AgeTypeId { get; set; }
        public int SexId { get; set; }
       
        public string Sex { get; set; }
        public string AgeType { get; set; }

        public virtual PreSedation PreSedation { get; set; }
        public virtual SedationMonitoring SedationMonitoring { get; set; }
        public virtual SedationRecoveryRoomRecord SedationRoomRecord { get; set; }
    }
}
