using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Core.Interface
{
    public interface IRepository<T> where T : class
    {
        T Add(T entity);
        void Update(T entity);
        void UpdateForce(T entity);
        void Delete(T entity);

        T GetById(object id);
        T GetByCriteria(Func<T, bool> criteria);
        IQueryable<T> GetAll();
        IQueryable<T> GetAllNoTracking();
        IQueryable<T> GetAllByCriteria(Func<T, bool> criteria);

        int Commit();
    }

    public interface IDbHelper<T> where T : class
    {
        List<T> GetAll(string sql, object parameter = null);
        T Get(string sql, object parameter = null);
        int ExecuteCommand(string sql, object parameter = null);
    }
}
