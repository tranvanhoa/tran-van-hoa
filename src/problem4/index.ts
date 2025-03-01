// Recursion
// Time Complexity: O(n)
// Space Complexity: O(n)
function sum_to_n_a(n: number): number {
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_a(n - 1);
}

// For loop
// Time Complexity: O(n)
// Space Complexity: O(1)
function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Formula
// Time Complexity: O(1)
// Space Complexity: O(1)
function sum_to_n_c(n: number): number {
  return (n * (n + 1)) / 2;
}
