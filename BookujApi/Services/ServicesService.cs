using BookujApi.Data;
using BookujApi.Models;
using BookujApi.Models.Dto;
using Microsoft.EntityFrameworkCore;
using Supabase;
using Supabase.Storage;

namespace BookujApi.Services
{
    public class ServicesService
    {
        private readonly AppDbContext _db;
        private readonly Supabase.Client _cdn;

        public ServicesService(AppDbContext db, Supabase.Client cdn)
        {
            _db = db;
            _cdn = cdn;
        }

        //public async Task<Service> GetAllBusinessServices()
        //{

        //}
    }
}
