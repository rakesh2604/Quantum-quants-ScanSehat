import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import ThemeToggle from "../ThemeToggle";
import { useThemeStore } from "../../stores/themeStore";

describe("ThemeToggle", () => {
  afterEach(() => {
    cleanup();
    useThemeStore.setState({ mode: "light" });
    document.documentElement.classList.remove("dark");
  });

  it("shows sun icon in light mode", () => {
    const { getByLabelText, getByText } = render(<ThemeToggle />);
    expect(getByLabelText(/toggle color mode/i)).toBeInTheDocument();
    expect(getByText("☀️")).toBeInTheDocument();
  });

  it("toggles to dark mode on click", () => {
    const { getByLabelText } = render(<ThemeToggle />);
    fireEvent.click(getByLabelText(/toggle color mode/i));
    expect(useThemeStore.getState().mode).toBe("dark");
  });
});

