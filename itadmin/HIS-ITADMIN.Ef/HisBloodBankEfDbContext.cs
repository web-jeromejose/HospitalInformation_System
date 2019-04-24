
using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Core.EntityClient;
using HIS_ITADMIN_EF.Core.Model;
using HIS_ITADMIN_EF.Core.Helper;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace HIS_ITADMIN_EF.Infra
{
    public class HIS_ITADMIN_EFDbContext : DbContext
    {

        public HIS_ITADMIN_EFDbContext()
            : base(){
            string encrypted = System.Configuration.ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ToString();
            string decrypted = Cypher.Decrypt(encrypted, true);
            Database.Connection.ConnectionString = decrypted;
            Database.CreateIfNotExists();
        }

        public DbSet<Donor> Donor { get; set; }
        public DbSet<DonorVitalSign> DonorVitalSign { get; set; }
        public DbSet<DonorQuestionaire> DonorQuestionaire { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Donor>().ToTable("Donor", "BBEF");
            modelBuilder.Entity<DonorVitalSign>().ToTable("DonorVitalSign", "BBEF");
            modelBuilder.Entity<DonorQuestionaire>().ToTable("DonorQuestionaire", "BBEF");
        }

    }
}
