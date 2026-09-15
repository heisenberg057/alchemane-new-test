import type { CSSProperties, ReactNode } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

function DiagramCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[12px] border border-[#121212]/[0.06] bg-white px-5 py-4 text-center shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

function DiagramText({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[#121212] text-[14px] leading-[1.45] tracking-[-0.2px] md:text-[18px] ${className}`}>
      {children}
    </p>
  );
}

function DecisionBadge({
  tone,
  label,
  className = '',
  style,
}: {
  tone: 'yes' | 'no';
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  const palette =
    tone === 'yes'
      ? 'bg-[#DCFCE7] text-[#16A34A]'
      : 'bg-[#FEE2E2] text-[#EF4444]';

  return (
    <div
      className={`inline-flex items-center justify-center rounded-[8px] px-2 py-1 ${palette} ${className}`}
      style={style}
    >
      <span className="text-[14px] font-bold leading-none md:text-[18px]">{label}</span>
    </div>
  );
}

function DesktopDiagram() {
  return (
    <div className="relative mt-12 hidden h-[900px] w-full max-w-[760px] md:block">
      <svg
        className="absolute inset-0 z-0 h-full w-full overflow-visible"
        viewBox="0 0 760 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="desktopArrow"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0 0L10 5L0 10V0Z" fill="#121212" />
          </marker>
        </defs>

        <line x1="380" y1="96" x2="380" y2="152" stroke="#121212" strokeWidth="1.5" markerEnd="url(#desktopArrow)" />
        <line x1="380" y1="260" x2="380" y2="312" stroke="#121212" strokeWidth="1.5" />
        <line x1="182" y1="312" x2="578" y2="312" stroke="#121212" strokeWidth="1.5" />
        <line x1="182" y1="312" x2="182" y2="382" stroke="#121212" strokeWidth="1.5" markerEnd="url(#desktopArrow)" />
        <line x1="578" y1="312" x2="578" y2="382" stroke="#121212" strokeWidth="1.5" markerEnd="url(#desktopArrow)" />

        <line x1="182" y1="504" x2="182" y2="562" stroke="#121212" strokeWidth="1.5" />
        <line x1="182" y1="562" x2="380" y2="562" stroke="#121212" strokeWidth="1.5" />
        <line x1="380" y1="562" x2="380" y2="620" stroke="#121212" strokeWidth="1.5" markerEnd="url(#desktopArrow)" />

        <line x1="380" y1="724" x2="380" y2="782" stroke="#121212" strokeWidth="1.5" markerEnd="url(#desktopArrow)" />
      </svg>

      <div className="absolute left-1/2 top-0 w-[420px] -translate-x-1/2">
        <DiagramCard className="px-8 py-5">
          <DiagramText>
            Do you have <span className="font-bold">1½ inch to 1 inch</span> of natural hair
            <br />
            in the front?
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute left-1/2 top-[160px] w-[420px] -translate-x-1/2">
        <DiagramCard className="px-8 py-5">
          <DiagramText>
            Is the <span className="font-bold">density good?</span>
            <br />
            (no gaps, no scalp showing)
          </DiagramText>
        </DiagramCard>
      </div>

      <DecisionBadge
        tone="yes"
        label="Yes"
        className="absolute z-10 -translate-x-1/2"
        style={{ left: 182, top: 336 }}
      />
      <DecisionBadge
        tone="no"
        label="No"
        className="absolute z-10 -translate-x-1/2"
        style={{ left: 578, top: 336 }}
      />

      <div className="absolute left-[60px] top-[392px] w-[220px]">
        <DiagramCard className="px-6 py-6">
          <DiagramText>
            You can <span className="font-bold">use your own hair</span>
            <br />
            in front
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute right-[60px] top-[392px] w-[220px]">
        <DiagramCard className="px-6 py-6">
          <DiagramText>
            Brush-back style <span className="font-bold">not</span>
            <br />
            <span className="font-bold">recommended</span>
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute left-1/2 top-[618px] w-[320px] -translate-x-1/2">
        <DiagramCard className="px-8 py-5">
          <DiagramText>
            Willing to use <span className="font-bold">fiber powder</span>
            <br />
            (e.g., Toppik)?
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute left-1/2 top-[780px] w-[320px] -translate-x-1/2">
        <DiagramCard className="px-8 py-5">
          <DiagramText>
            Use <span className="font-bold">fiber + system</span> behind for
            <br />
            natural hairline
          </DiagramText>
        </DiagramCard>
      </div>
    </div>
  );
}

function MobileDiagram() {
  return (
    <div className="relative mt-10 h-[810px] w-full max-w-[320px] md:hidden">
      <svg
        className="absolute inset-0 z-0 h-full w-full overflow-visible"
        viewBox="0 0 320 810"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="mobileArrow"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0 0L10 5L0 10V0Z" fill="#121212" />
          </marker>
        </defs>

        <line x1="160" y1="92" x2="160" y2="132" stroke="#121212" strokeWidth="1.5" markerEnd="url(#mobileArrow)" />
        <line x1="160" y1="224" x2="160" y2="260" stroke="#121212" strokeWidth="1.5" />
        <line x1="72" y1="260" x2="248" y2="260" stroke="#121212" strokeWidth="1.5" />
        <line x1="72" y1="260" x2="72" y2="322" stroke="#121212" strokeWidth="1.5" markerEnd="url(#mobileArrow)" />
        <line x1="248" y1="260" x2="248" y2="322" stroke="#121212" strokeWidth="1.5" markerEnd="url(#mobileArrow)" />

        <line x1="72" y1="450" x2="72" y2="498" stroke="#121212" strokeWidth="1.5" />
        <line x1="72" y1="498" x2="160" y2="498" stroke="#121212" strokeWidth="1.5" />
        <line x1="160" y1="498" x2="160" y2="546" stroke="#121212" strokeWidth="1.5" markerEnd="url(#mobileArrow)" />

        <line x1="160" y1="650" x2="160" y2="694" stroke="#121212" strokeWidth="1.5" markerEnd="url(#mobileArrow)" />
      </svg>

      <div className="absolute left-1/2 top-0 w-[242px] -translate-x-1/2">
        <DiagramCard className="px-4 py-4">
          <DiagramText>
            Do you have <span className="font-bold">1½ inch to 1 inch</span> of
            <br />
            natural hair in the front?
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute left-1/2 top-[140px] w-[242px] -translate-x-1/2">
        <DiagramCard className="px-4 py-4">
          <DiagramText>
            Is the <span className="font-bold">density good?</span>
            <br />
            (no gaps, no scalp showing)
          </DiagramText>
        </DiagramCard>
      </div>

      <DecisionBadge
        tone="yes"
        label="Yes"
        className="absolute z-10 -translate-x-1/2"
        style={{ left: 72, top: 278 }}
      />
      <DecisionBadge
        tone="no"
        label="No"
        className="absolute z-10 -translate-x-1/2"
        style={{ left: 248, top: 278 }}
      />

      <div className="absolute left-0 top-[330px] w-[144px]">
        <DiagramCard className="px-3 py-4">
          <DiagramText>
            You can use your
            <br />
            <span className="font-bold">own hair</span> in front
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute right-0 top-[330px] w-[144px]">
        <DiagramCard className="px-3 py-4">
          <DiagramText>
            Brush-back style
            <br />
            <span className="font-bold">not recommended</span>
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute left-1/2 top-[548px] w-[242px] -translate-x-1/2">
        <DiagramCard className="px-4 py-4">
          <DiagramText>
            Willing to use <span className="font-bold">fiber powder</span>
            <br />
            (e.g., Toppik)?
          </DiagramText>
        </DiagramCard>
      </div>

      <div className="absolute left-1/2 top-[696px] w-[242px] -translate-x-1/2">
        <DiagramCard className="px-4 py-4">
          <DiagramText>
            Use <span className="font-bold">fiber + system</span> behind for
            <br />
            natural hairline
          </DiagramText>
        </DiagramCard>
      </div>
    </div>
  );
}

export const NaturalHairlineFlowchart = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-[#F5F6F7] py-16 md:py-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 md:px-10 xl:px-[160px]">
        <h2 className="max-w-[720px] text-center text-[24px] font-extrabold leading-[1.18] tracking-[-0.4px] text-[#121212] md:text-[44px] md:tracking-[-0.5px]">
          Can You Use Your Own Front Hair
          <br />
          For A Brush-Back Style?
        </h2>

        <DesktopDiagram />
        <MobileDiagram />
      </div>
    </section>
    </AnimateOnScroll>
  );
};
