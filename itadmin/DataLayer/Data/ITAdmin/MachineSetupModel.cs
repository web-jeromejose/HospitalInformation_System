using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.ITAdmin.Model
{
    public class MachineSetupModel
    {
        public string ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DepartmentID { get; set; }
        public string LocationID { get; set; }
        public string LocationName { get; set; }
        public string Room { get; set; }
        public string AcquisitionDate { get; set; }
        public string CommisionDate { get; set; }
        public string Department { get; set; }
        public string Location { get; set; }
        public string ModalityID { get; set; }
        public string ModalityCode { get; set; }
        public string DoctorId { get; set; }
    }
}

