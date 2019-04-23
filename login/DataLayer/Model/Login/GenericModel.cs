using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer
{
    public class GenericModel
    {
        
    }
    public class ListModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }
    public class ListAttr1Model
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string attr1 { get; set; }
    }
    public class ListAttr2Model
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string attr1 { get; set; }
        public string attr2 { get; set; }
    }
    public class Response
    {
        public string Flag { get; set; }
        public string Message { get; set; }
    }

    public class PatientBasicModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }

        public string Sex { get; set; }
        public string Age { get; set; }
        public string Company { get; set; }

    }
    public class IPServiceModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string itemlevel { get; set; }
    }
    public class WardsModel
    {
        public string StationID { get; set; }
        public string StationName { get; set; }
        public string BedID { get; set; }
        public string BedName { get; set; }
        public string BedTypeID { get; set; }
        public string BedTypeName { get; set; }
        public string BedTypeLabel { get; set; }
        public string BedStatID { get; set; }
        public string BedStatus { get; set; }
        public string PatientName { get; set; }
        public string IPID { get; set; }
        public string RegistrationNo { get; set; }
        public string PIN { get; set; }
        public string AdmitDateTime { get; set; }

        public string Company { get; set; }
        public string Doctor { get; set; }
        public string StayIn { get; set; }

    }
}
