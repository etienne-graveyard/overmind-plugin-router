import { add } from "../src/index";

test("add two number", () => {
  expect(add(2, 3)).toBe(5);
});
