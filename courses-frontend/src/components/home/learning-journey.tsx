import { BookOpen, UserRound, Video, ArrowRight } from 'lucide-react';

const STEPS = [
  { step: 1, icon: BookOpen, title: 'Choose a course', detail: 'Pick the topic you want to learn.' },
  { step: 2, icon: UserRound, title: 'Create your account', detail: "It's quick and easy." },
  { step: 3, icon: Video, title: 'Join your live class', detail: 'Learn with our expert instructors.' },
];

export function LearningJourney() {
  return (
    <section id="learning-journey" className="scroll-mt-20 bg-white py-[56px]">
      <div className="page text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#1a6ef0]">Simple steps to get started</p>
        <h2 className="mt-[10px] text-[30px] font-extrabold leading-[1.2] tracking-tight text-[#0a1b3f] sm:text-[34px]">
          Your Learning Journey
        </h2>

        <div className="relative mx-auto mt-[40px] grid max-w-[820px] gap-10 sm:grid-cols-3 sm:gap-6">
          {STEPS.map(({ step, icon: Icon, title, detail }, index) => (
            <div key={step} className="relative flex flex-col items-center gap-[10px]">
              {index < STEPS.length - 1 ? (
                <ArrowRight
                  className="absolute -right-4 top-[30px] hidden h-[20px] w-[20px] text-[#1a6ef0]/45 sm:block"
                  strokeWidth={2.5}
                  aria-hidden
                />
              ) : null}

              <span className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#e8f1ff] text-[#1a6ef0]">
                <Icon className="h-[27px] w-[27px]" strokeWidth={1.7} />
                <span className="absolute -top-1 -right-1 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#1a6ef0] text-[11px] font-bold text-white shadow-sm">
                  {step}
                </span>
              </span>
              <h3 className="text-[15.5px] font-bold text-[#0a1b3f]">{title}</h3>
              <p className="max-w-[200px] text-[13px] leading-[1.35] text-[#5b6d89]">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
