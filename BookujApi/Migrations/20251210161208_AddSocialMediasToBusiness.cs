using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookujApi.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialMediasToBusiness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacebookUrl",
                table: "Businesses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramUrl",
                table: "Businesses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WebsiteUrl",
                table: "Businesses",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookUrl",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "InstagramUrl",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "WebsiteUrl",
                table: "Businesses");
        }
    }
}
