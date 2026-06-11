import { Target } from "lucide-react";

export default async function MockInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
        <Target className="w-8 h-8 text-indigo-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Mock Interview Coming Soon</h1>
      <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
        The interactive mock interview functionality is currently under development. Once the AI generation pipeline is fully active, you will be able to practice tailored interview questions here for session <span className="font-mono text-zinc-400">{id}</span>.
      </p>
    </div>
  );
}
