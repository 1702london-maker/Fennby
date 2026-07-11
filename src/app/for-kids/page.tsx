import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const goodies = [
  { emoji: "🧠", title: "Practice", body: "Bite-sized questions in your subjects, so revision never feels like a mountain." },
  { emoji: "📝", title: "Mock Exams", body: "Take a mock however suits you: on screen, on paper, or the full timed simulation." },
  { emoji: "🛠️", title: "The Workshop", body: "Stuck on something? Get it explained a different way until it clicks, plus real photo homework help." },
  { emoji: "🤖", title: "AI Tutor", body: "Ask questions any time of day and get friendly help straight away, no waiting." },
  { emoji: "🎥", title: "The Cradle", body: "Live video lessons with your own tutor, with a shared whiteboard you can both draw on." },
  { emoji: "🎮", title: "Games", body: "Learning that's actually a game, not homework in disguise." },
  { emoji: "🏅", title: "Badges", body: "Collect badges for the things you're proud of, and watch your collection grow." },
  { emoji: "🧵", title: "Craft Club", body: "Bag making, shoemaking, sewing. Real skills, made with your own hands." },
  { emoji: "🏕️", title: "Camps", body: "Summer camps that are actually fun, not just more school." },
];

export default function ForKidsPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-coral-100 text-brick-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
              HEY, YOU!
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              Welcome to Fennby, your own corner of the internet for getting brilliant at stuff.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              Practice, mock exams, an AI Tutor who never gets tired of your questions, craft
              projects you actually finish, and badges to show for all of it. Ask a grown-up to
              get you set up, and this is what you&apos;ll find waiting.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/child-login" variant="primary">Log in to my Kids Portal</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="coral" className="w-full max-w-sm text-center">
              <span className="text-4xl" aria-hidden>🏅</span>
              <p className="font-display font-bold text-lg mt-3">Collect badges as you go</p>
              <p className="text-sm text-charcoal-teal/80 mt-2">
                Every mock exam, every practice streak, every craft project finished, all of it
                earns you something to show for it.
              </p>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {goodies.map((g) => (
              <Card key={g.title}>
                <span className="text-3xl" aria-hidden>{g.emoji}</span>
                <h3 className="font-display font-bold text-lg mt-3 mb-1">{g.title}</h3>
                <p className="text-sm text-charcoal-teal/80 leading-relaxed">{g.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-teal-100">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center">
            <h2 className="font-display font-bold text-2xl mb-3 text-teal-900">
              Need things a bit different? We&apos;ve got you.
            </h2>
            <p className="text-charcoal-teal/80 leading-relaxed max-w-xl mx-auto">
              Bigger text, a calmer look, reading things out loud, extra time on exams, symbols
              alongside words, whatever helps you learn best. It&apos;s already built in, it&apos;s
              free, and you choose it yourself in your own Settings.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <Card tint="coral" className="mb-8">
            <p className="font-display font-bold text-lg">
              Your grown-up can always see what you&apos;re up to, that&apos;s the deal that
              keeps everyone happy and safe.
            </p>
          </Card>
          <h2 className="font-display font-bold text-3xl mb-4">Ready to jump in?</h2>
          <p className="text-charcoal-teal/80 mb-8">
            Ask your parent to set up your Fennby account, then come back here and log in to
            your own Kids Portal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/child-login" variant="primary">Log in to my Kids Portal</Button>
            <Button href="/for-families" variant="outline">I&apos;m a parent, tell me more</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
