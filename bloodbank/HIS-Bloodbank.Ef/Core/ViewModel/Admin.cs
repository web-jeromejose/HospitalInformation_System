using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.ViewModel
{
    public class VmBase
    {
        public VmBase()
        {
            Active = true;
            CreatedAt = DateTime.Now.ToString();
            BackColor = "#36A2EB";
            HoverColor = "#36A2EB";
        }

        public string Id { get; set; }
        public bool Active { set; get; }
        public string CreatedBy { set; get; }
        public string CreatedAt { set; get; }
        public string ModifiedBy { set; get; }
        public string ModifiedAt { set; get; }
        public string BackColor { set; get; }
        public string HoverColor { set; get; }
    }

    public class SelectVm
    {
        public string Id { get; set; }
        public string Name { set; get; }
    }


}
