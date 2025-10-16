import SolveProblem from '@/components/dsa/SolveProblem';

type Props = {
  params: {
    problemId: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Page({ params }: Props) {
  return <SolveProblem problemId={params.problemId} />;
}
