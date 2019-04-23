using OTEf.Core.Interface;
using OTEf.Infra;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Impl {
    public class OTEfRepository<T> : IRepository<T> where T : class {
        private OTEfDbContext context;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Your DbContext, that will be injected to this Repository object</param>
        public OTEfRepository(OTEfDbContext context) {
            this.context = context;
        }

        /// <summary>
        /// Add Entity
        /// </summary>
        /// <param name="entity">Your Entity to be added e.g. Person</param>
        /// <returns name="entity">The added Entity with Id set from database.</param>
        public T Add(T entity) {
            return Entity.Add(entity);
        }

        /// <summary>
        /// Update Entity
        /// </summary>
        /// <param name="entity">Your Entity to be updated e.g. Person</param>
        /// <returns name="void"></param>
        public void Update(T entity) {
            if (entity == null) {
                throw new Exception("Not exists!");
            }
        }

        public void UpdateForce(T entity)
        {
            if (entity == null)
            {
                throw new Exception("Not exists!");
            }
            context.Entry(entity).State = EntityState.Modified;
        }

        /// <summary>
        /// Delete Entity
        /// </summary>
        /// <param name="entity">Your Entity to be deleted e.g. Person</param>
        /// <returns name="void"></param>
        public void Delete(T entity) {
            Entity.Remove(entity);
        }

        public void DeleteByCriteria(Func<T, bool> criteria)
        {
            Entity.Where(criteria).ToList().ForEach(p => Entity.Remove(p));
        } 

        /// <summary>
        /// Get Entity By Id
        /// </summary>
        /// <param name="id">your entity id</param>
        /// <returns name="Entity">Entity</param>
        public T GetById(object id) {
            return Entity.Find(id);
        }
        /// <summary>
        /// Get Entity by specified criteria
        /// </summary>
        /// <param name="criteria">Lamda expression</param>
        /// <returns name="Entity"></param>
        public T GetByCriteria(Func<T, bool> criteria) {
            return Entity.Where(criteria).SingleOrDefault();
        }
        /// <summary>
        /// Get All Entity as IQueriable
        /// </summary>        
        /// <returns name="IQueryable"></param>
        public IQueryable<T> GetAll() {
            return Entity.AsQueryable<T>();
        }

        public IQueryable<T> GetAllNoTracking()
        {
            return Entity.AsNoTracking().AsQueryable<T>();
        }

        /// <summary>
        /// Get All Entity as IQueriable by specified criteria
        /// </summary>        
        /// <param name="criteria">Lamda expression</param>
        /// <returns name="IQueryable"></param>
        public IQueryable<T> GetAllByCriteria(Func<T, bool> criteria) {
            return Entity.Where(criteria).AsQueryable<T>();
        }

        /// <summary>
        /// Entity, provides and access to you Entity.
        /// </summary>        
        /// <returns name="Entity">you entity</param>
        public IDbSet<T> Entity {
            get { return context.Set<T>(); }
        }

        /// <summary>
        /// Commit: to flush changes in the current context to your database.
        /// </summary>        
        /// <returns name="int">Number of affected records.</param>
        public int Commit() {
            return context.SaveChanges();
        }
    }
}
