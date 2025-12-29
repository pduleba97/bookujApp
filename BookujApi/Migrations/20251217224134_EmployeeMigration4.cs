using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookujApi.Migrations
{
    /// <inheritdoc />
    public partial class EmployeeMigration4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Employees",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Employees");
        }
    }
}
