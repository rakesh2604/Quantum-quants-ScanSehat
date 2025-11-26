import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimelineAnimated, { TimelineItem } from "../TimelineAnimated";

const items: TimelineItem[] = [
  { id: "1", title: "Upload", description: "Encrypted MRI", timestamp: "Step 1" },
  { id: "2", title: "Share", description: "OTP issued", timestamp: "Step 2" }
];

describe("TimelineAnimated", () => {
  it("renders all timeline items", () => {
    render(<TimelineAnimated items={items} />);
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });
});

