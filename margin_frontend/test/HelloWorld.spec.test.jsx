import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import HelloWorld from "../components/HelloWorld";

describe("HelloWorld test component", () => {
	it("renders name and counter works", async () => {
		render(<HelloWorld name="Vitest" />);

		await screen.findByText("Hello Vitest x1!");
		await userEvent.click(screen.getByRole("button", { name: "Increment" }));

		await screen.findByText("Hello Vitest x2!");
	});
});
