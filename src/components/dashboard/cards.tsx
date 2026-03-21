import type { ReactNode } from "react";

import type { DashboardCardItem } from "./model";

type DashboardCardGridProps = {
  cards: DashboardCardItem[];
  isDesktopSidebarCollapsed: boolean;
  onCardOpen: (card: DashboardCardItem) => void;
};

type DashboardCardModalProps = {
  card: DashboardCardItem;
  onClose: () => void;
};

type DashboardCardProps = {
  card: DashboardCardItem;
  onOpen: (card: DashboardCardItem) => void;
};

const DASHBOARD_CARD_PREVIEW_MAX_LENGTH = 60;
const TRAILING_PUNCTUATION_PATTERN = /[.,;:!?]+$/;
const SOFT_DIVIDER_COLOR = "var(--ui-divider-soft)";
const SOFT_BORDER = `0.5px solid ${SOFT_DIVIDER_COLOR}`;
const SURFACE_TEXT_CLASS = "text-[var(--ui-text-primary)]";
const MUTED_TEXT_CLASS = "text-[var(--ui-text-secondary)]";
const DASHBOARD_GRID_BASE_CLASS =
  "custom-scrollbar grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto pb-4 pr-1 pt-4 sm:grid-cols-2 md:pt-6 lg:gap-5 lg:pb-0";
const DASHBOARD_CARD_CLASS =
  "flex min-h-[184px] overflow-hidden rounded-xl bg-[var(--ui-surface)] shadow-[0_1px_2px_rgba(31,31,31,0.03)] lg:min-h-[198px]";
const DASHBOARD_CARD_CONTENT_CLASS = "flex min-h-full flex-1 flex-col gap-3 p-5 lg:p-6";
const DASHBOARD_CARD_TITLE_CLASS = `ui-text-card-title font-semibold tracking-[0.01em] ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_CARD_DESCRIPTION_CLASS = `ui-text-body-sm max-w-[34ch] ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_CARD_FOOTER_CLASS = "mt-auto flex items-center justify-between gap-3";
const DASHBOARD_CARD_DATE_CLASS = `ui-text-meta font-medium leading-none ${MUTED_TEXT_CLASS}`;
const DASHBOARD_CARD_BUTTON_CLASS =
  `ui-text-button shrink-0 cursor-pointer rounded-lg bg-[var(--ui-surface-muted)] px-3.5 py-2 font-medium leading-none ${SURFACE_TEXT_CLASS} outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[var(--ui-surface-muted)] hover:bg-[var(--ui-surface-muted)] lg:px-4`;
const DASHBOARD_MODAL_OVERLAY_CLASS =
  "fixed inset-0 z-[60] flex items-center justify-center bg-[var(--ui-overlay)] px-3 py-4";
const DASHBOARD_MODAL_PANEL_CLASS =
  "custom-scrollbar w-[min(34rem,calc(100vw-1.5rem))] max-h-[min(34rem,calc(100dvh-2rem))] overflow-y-auto rounded-xl bg-[var(--ui-surface)] p-5 sm:p-6";
const DASHBOARD_MODAL_TITLE_CLASS = `ui-text-dialog-title font-semibold ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_MODAL_DETAILS_CLASS = `ui-text-dialog-reading ${SURFACE_TEXT_CLASS}`;
const DASHBOARD_MODAL_DATE_CLASS = `ui-text-meta font-medium ${MUTED_TEXT_CLASS}`;
const DASHBOARD_MODAL_CLOSE_BUTTON_CLASS =
  "ui-text-button h-10 shrink-0 cursor-pointer rounded-lg px-4 font-medium text-[var(--ui-text-inverse)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[var(--ui-primary)] hover:bg-[var(--ui-primary)]";
const DASHBOARD_MODAL_LIST_CLASS = `list-disc space-y-2 pl-7 ${DASHBOARD_MODAL_DETAILS_CLASS}`;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function trimTrailingPunctuation(value: string) {
  return value.trim().replace(TRAILING_PUNCTUATION_PATTERN, "");
}

function getCardDescriptionPreview(text: string, maxLength: number = DASHBOARD_CARD_PREVIEW_MAX_LENGTH) {
  const normalizedText = text.trim();

  if (normalizedText.length <= maxLength) {
    return `${trimTrailingPunctuation(normalizedText)}...`;
  }

  const slice = normalizedText.slice(0, maxLength + 1);
  const lastWordBreak = slice.lastIndexOf(" ");
  const preview = trimTrailingPunctuation(
    lastWordBreak > 0 ? slice.slice(0, lastWordBreak) : normalizedText.slice(0, maxLength),
  );

  return `${preview}...`;
}

function renderHighlightedDescription(text: string, highlight?: string): ReactNode {
  if (!highlight) {
    return text;
  }

  const highlightIndex = text.indexOf(highlight);
  if (highlightIndex === -1) {
    return text;
  }

  const beforeHighlight = text.slice(0, highlightIndex);
  const afterHighlight = text.slice(highlightIndex + highlight.length);

  return (
    <>
      {beforeHighlight}
      <strong className="font-semibold">{highlight}</strong>
      {afterHighlight}
    </>
  );
}

function DashboardCard({ card, onOpen }: DashboardCardProps) {
  const descriptionPreview = getCardDescriptionPreview(card.description);

  return (
    <article className={DASHBOARD_CARD_CLASS} style={{ border: SOFT_BORDER }}>
      <div className={DASHBOARD_CARD_CONTENT_CLASS}>
        <div className="space-y-2">
          <p className={DASHBOARD_CARD_TITLE_CLASS}>{card.title}</p>
          <p className={DASHBOARD_CARD_DESCRIPTION_CLASS}>{descriptionPreview}</p>
        </div>

        <div className={DASHBOARD_CARD_FOOTER_CLASS}>
          <p className={DASHBOARD_CARD_DATE_CLASS}>{card.dateTime}</p>
          <button
            type="button"
            onClick={() => onOpen(card)}
            className={DASHBOARD_CARD_BUTTON_CLASS}
            style={{ border: SOFT_BORDER }}
          >
            Read more
          </button>
        </div>
      </div>
    </article>
  );
}

export function DashboardCardGrid({ cards, isDesktopSidebarCollapsed, onCardOpen }: DashboardCardGridProps) {
  return (
    <section className={cn(DASHBOARD_GRID_BASE_CLASS, isDesktopSidebarCollapsed ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
      {cards.map((card) => (
        <DashboardCard key={card.id} card={card} onOpen={onCardOpen} />
      ))}
    </section>
  );
}

export function DashboardCardModal({ card, onClose }: DashboardCardModalProps) {
  return (
    <div className={DASHBOARD_MODAL_OVERLAY_CLASS} onClick={onClose}>
      <div className={DASHBOARD_MODAL_PANEL_CLASS} style={{ border: SOFT_BORDER }} onClick={(event) => event.stopPropagation()}>
        <div className="space-y-4">
          <h2 className={DASHBOARD_MODAL_TITLE_CLASS}>{card.title}</h2>

          <div className="min-h-[140px] rounded-lg bg-[var(--ui-surface-muted)] p-4" style={{ border: SOFT_BORDER }}>
            <div className="space-y-3">
              <p className={DASHBOARD_MODAL_DETAILS_CLASS}>{card.description}</p>
              {card.modalIntro ? <p className={DASHBOARD_MODAL_DETAILS_CLASS}>{card.modalIntro}</p> : null}
              {card.modalDescription ? (
                <p className={DASHBOARD_MODAL_DETAILS_CLASS}>
                  {renderHighlightedDescription(card.modalDescription, card.modalDescriptionHighlight)}
                </p>
              ) : null}
              {card.modalListItems?.length ? (
                <ul className={DASHBOARD_MODAL_LIST_CLASS}>
                  {card.modalListItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className={DASHBOARD_MODAL_DATE_CLASS}>{card.dateTime}</p>
            <button
              type="button"
              onClick={onClose}
              className={DASHBOARD_MODAL_CLOSE_BUTTON_CLASS}
              style={{ border: SOFT_BORDER, backgroundColor: "var(--ui-primary)" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
