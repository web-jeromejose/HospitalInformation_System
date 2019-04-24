using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class CancellationTypeMappingModel
    {
        public long Id { get; set; }
        [DisplayName("Cancellation Type")]
        public int MainReasonId { get; set; }
        public string MainReasonName { get; set; }
        public string Code { get; set; }
        [DisplayName("Reason")]
        public string Name { get; set; }
        public string DetailName { get; set; }
        public string STDate { get; set; }
        public int Del { get; set; }
    }
}
