using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(builder =>
	{
		builder.AllowAnyOrigin()
			.AllowAnyMethod()
			.AllowAnyHeader();
	});
});

// Return problem+json for all exceptions and other problem responses
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();

app.MapGet("/market/{id}", async (Guid id) =>
{
	await Task.Delay(1000);

	if (id != Guid.Parse("0CCB2598-CA6D-48CF-A78D-45CD04044CE0"))
		return Results.NotFound();

	return Results.Ok(new FruitMarket("Vredenburgplein", "Utrecht"));
});

app.MapPost("/market", (FruitMarket market) =>
{
	string[] notGood = ["bad", "fail", "error"];

	if (notGood.Contains(market.Name))
	{
		return Results.ValidationProblem(errors: new Dictionary<string, string[]>
		{
			{ "Name", [ "Preserved value" ] }
		},
		detail: "The provided value(s) did not meet the minimum requirements. Please review and update accordingly");
	}

	return Results.Ok(new { Status = "Success!", Key = Guid.NewGuid() });
});

app.MapGet("/market/problemdetail/{what}", async (string what, [FromQuery] bool? delay) =>
{
	if (delay == true)
		await Task.Delay(1500);

	var result = what switch
	{
		"problem" => Results.Problem(detail: "No details known at the moment", title: "There is a problem"),
		"exception" => throw new Exception("This exception is always thrown for 'exeption'"),
		"notfound" => Results.NotFound(),
		"notfoundjson" => Results.NotFound(new { What = what, Duration = "That took a little longer than desired" }),
		"empty" => Results.Empty,
		"validation" => Results.ValidationProblem(
			errors: new Dictionary<string, string[]>
			{
				{ nameof(what), ["value_a", "value_b" ] }
				},
			detail: "This message reveals all relevant details to evaluate the provided value(s)"),
		"nocontent" => Results.NoContent(),
		"unautherized" => Results.Unauthorized(),
		"redirect" => Results.Redirect("/some-other-place"),
		_ => Results.Ok(new
		{
			Number = Random.Shared.Next(),
			Market = new FruitMarket("Grote Markt", "Groningen")
		})
	};

	return result;
});

app.Run();

record FruitMarket(string Name, string Location);