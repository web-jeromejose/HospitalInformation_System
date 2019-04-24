using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Core.Model
{
    public class BaseModel
    {
        public BaseModel()
        {
            CreatedAt = DateTime.Now;
            Active = true;
        }
        public int Id { set; get; }
        [StringLength(256)]
        public string CreatedBy { set; get; }
        [StringLength(256)]
        public string ModifiedBy { set; get; }
        public DateTime CreatedAt { set; get; }
        public DateTime? ModifiedAt { set; get; }
        public bool Active { set; get; }
    }

    public class DefaultFilter
    {
        [StringLength(256)]
        public string Name { set; get; } //default filter
        public int Start { set; get; }
        public int TotalCount { set; get; }
        public int PageSize { set; get; }
        public bool? Active { set; get; }
    }

    public class Select2Dto
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }

    public class AjaxDataTableModel
    {
        public int Draw { get; set; }
        public int Start { get; set; }
        public int Length { get; set; }
        public int TotalRecords { get; set; }
        public int FilteredRecords { get; set; }
        public List<Column> Columns { get; set; }
        public Search Search { get; set; }
        public List<Order> Order { get; set; }
    }

    public class Column
    {
        public string Data { get; set; }
        public string Name { get; set; }
        public bool Searchable { get; set; }
        public bool Orderable { get; set; }
        public Search Search { get; set; }
    }

    public class Search
    {
        public string Value { get; set; }
        public string Regex { get; set; }
    }

    public class Order
    {
        public int Column { get; set; }
        public string Dir { get; set; }
    }

}
