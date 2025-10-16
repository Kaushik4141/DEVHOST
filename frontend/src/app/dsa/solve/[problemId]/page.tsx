import SolveProblem from '@/components/dsa/SolveProblem';

export default async function Page({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  return <SolveProblem problemId={problemId} />;
}
