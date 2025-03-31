import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { Title } from "../src/ui/layout/title";

describe("Vitest test component", () => {
	it("renders title", async () => {
		render(<Title title="Vitest" />);

		await screen.findByText("Vitest");
	});
});
