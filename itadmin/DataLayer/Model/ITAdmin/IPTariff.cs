using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.ITAdmin.Model
{


    public class IPTariff
    {
        public List<Tariff> TariffList { get; set; }
        public List<Services> ServicesList { get; set; }
    }

    public class TariffItemPriceList
    {
        public List<TariffItemPrice> PriceList {get;set;}
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public int ItemID { get; set; }
    }

    public class SearchResult
    {
        public int ID {get;set;}
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class Tariff
    {
        public int ID { get; set; }
        public string Name {get;set;}
    }

    public class Services
    {
        public int ID { get; set; }
        public string ServiceName { get; set; }
    }

    public class TariffItemPrice
    {
        public int BedTypeID { get; set; }
        public string BedType { get; set; }
        public double Price { get; set; }
        public DateTime? EffectiveFrom { get; set; } 
    }

    public class SaveTariffParam
    {
        public List<TariffItemPrice> PriceList { get; set; }
        public int ServiceID { get; set; }
        public int TariffID { get; set; }
        public int ItemID { get; set; }
        public int By { get; set; }
    }

    public class SaveTariffRevisedByParam
    {
        public int ServiceID { get; set; }
        public int TariffID { get; set; }        
        public int By { get; set; }
        public DateTime StartDate { get; set; }
        public double Percent { get; set; }
    }

    public class FindIPTariff
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    
    }

}
