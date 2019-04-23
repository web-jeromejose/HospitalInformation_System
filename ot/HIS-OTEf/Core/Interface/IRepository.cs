using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Interface
{
    public interface IRepository<T> where T : class
    {
        T Add(T entity);
        void Update(T entity);
        void UpdateForce(T entity);
        void Delete(T entity);
        void DeleteByCriteria(Func<T, bool> criteria);

        T GetById(object id);
        T GetByCriteria(Func<T, bool> criteria);
        IQueryable<T> GetAll();
        IQueryable<T> GetAllNoTracking();
        IQueryable<T> GetAllByCriteria(Func<T, bool> criteria);

        int Commit();
    }
}
