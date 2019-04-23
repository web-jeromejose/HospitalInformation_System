using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PresedationProposedProcedure :BaseModel
    {
        public int TestId { get; set; }
        public int Id { get; set; }
        public string TestName { get; set; }
        public string TestCode { get; set; }

    }
}
