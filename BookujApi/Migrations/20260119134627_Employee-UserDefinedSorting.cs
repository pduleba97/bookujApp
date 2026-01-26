using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookujApi.Migrations
{
    /// <inheritdoc />
    public partial class EmployeeUserDefinedSorting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "Employees",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "Employees");
        }
    }
}
