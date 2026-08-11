import React, { useEffect, useState } from "react";
import { captureChallengeAnswerSubmitted, captureChallengeStarted } from "@/lib/analytics";
import { cn, markChallengeCompleted } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { CheckIcon, ChevronLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { Solution } from "@/types";

interface SolutionInputProps {
  solutions: Solution[];
}

const WRONG_SOLUTION = "That's not the right person. Try again!";

export function SolutionInput({ solutions }: SolutionInputProps) {
  const [result, setResult] = useState<{ text: string; isFinal: boolean } | null>(null);
  const router = useRouterState();

  const pathname = router.location.pathname;

  useEffect(() => {
    captureChallengeStarted(pathname);
  }, [pathname]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const solution = formData.get("solution") as string;

    const normalizedSolution = solution.trim().toLowerCase();
    const foundSolution = solutions.find((s) => s.solution.trim().toLowerCase() === normalizedSolution);
    if (foundSolution) {
      captureChallengeAnswerSubmitted(pathname, foundSolution.final ? "completed" : "intermediate");

      if (foundSolution.final) {
        markChallengeCompleted(pathname);
      }

      return setResult({ text: foundSolution.text, isFinal: foundSolution.final });
    }

    captureChallengeAnswerSubmitted(pathname, "incorrect");
    return setResult({ text: WRONG_SOLUTION, isFinal: false });
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Submit Solution</h2>
      <form className="flex flex-col gap-4 md:flex-row" onSubmit={handleSubmit}>
        <Input name="solution" placeholder="Enter your solution here..." autoComplete="off" />
        <Button type="submit" className="flex-1 gap-2">
          <CheckIcon className="size-4" />
          Check Solution
        </Button>
      </form>
      {result && (
        <div
          role="alert"
          className={cn(
            "mt-4 flex flex-col items-start gap-2 text-sm font-bold",
            result.text === WRONG_SOLUTION && "text-destructive"
          )}
        >
          <span>{result.text}</span>
          {result.isFinal && (
            <Link to="/" className="mt-1 inline-flex items-center gap-1 font-medium hover:underline">
              <ChevronLeftIcon className="size-4" />
              Go back to homepage
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
