import SolveProblem from '@/components/dsa/SolveProblem';

export default function Page({ params }: { params: { problemId: string } }) {
  return <SolveProblem problemId={params.problemId} />;
}
