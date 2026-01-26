using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookujApi.Migrations
{
    /// <inheritdoc />
    public partial class OpeningHourvalidfromValidto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "ValidFrom",
                table: "OpeningHours",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "ValidTo",
                table: "OpeningHours",
                type: "date",
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE ""OpeningHours""
                SET ""DayOfWeek"" = CASE ""DayOfWeek""
                    WHEN 0 THEN 1
                    WHEN 1 THEN 2
                    WHEN 2 THEN 3
                    WHEN 3 THEN 4
                    WHEN 4 THEN 5
                    WHEN 5 THEN 6
                    WHEN 6 THEN 0
                END;
                ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValidFrom",
                table: "OpeningHours");

            migrationBuilder.DropColumn(
                name: "ValidTo",
                table: "OpeningHours");

            migrationBuilder.Sql(@"
                UPDATE ""OpeningHours""
                SET ""DayOfWeek"" = CASE ""DayOfWeek""
                    WHEN 0 THEN 6
                    WHEN 1 THEN 0
                    WHEN 2 THEN 1
                    WHEN 3 THEN 2
                    WHEN 4 THEN 3
                    WHEN 5 THEN 4
                    WHEN 6 THEN 5
                END;
                ");
        }
    }
}
