import { ArrowLeft } from "lucide-react";

import { ContentToolbar } from "@/components/content-toolbar";

import { DashboardCardDetailsContent } from "../cards";
import type { DashboardCardItem } from "../model";
import {
  CONTRACT_TERMS_BACK_BUTTON_CLASS,
  CONTRACT_TERMS_SCROLL_AREA_CLASS,
  CONTRACT_TERMS_SOFT_BORDER,
  CONTRACT_TERMS_SURFACE_CLASS,
  CONTRACT_TERMS_TITLE,
  CONTRACT_TERMS_VIEW_CLASS,
} from "./constants";
import { ContractTermsRetakeTable } from "./retake-table";

type ContractTermsViewProps = {
  card: DashboardCardItem;
  onBack: () => void;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ContractTermsBackButton({ onBack }: Pick<ContractTermsViewProps, "onBack">) {
  return (
    <button
      type="button"
      onClick={onBack}
      className={CONTRACT_TERMS_BACK_BUTTON_CLASS}
      style={{ border: CONTRACT_TERMS_SOFT_BORDER }}
    >
      <ArrowLeft size={18} strokeWidth={2} />
      <span>Back</span>
    </button>
  );
}

export function ContractTermsView({ card, onBack, className }: ContractTermsViewProps) {
  return (
    <div className={cn(CONTRACT_TERMS_VIEW_CLASS, className)}>
      <ContentToolbar title={CONTRACT_TERMS_TITLE} trailingContent={<ContractTermsBackButton onBack={onBack} />} />
      <section className={CONTRACT_TERMS_SURFACE_CLASS}>
        <div className={CONTRACT_TERMS_SCROLL_AREA_CLASS}>
          <DashboardCardDetailsContent card={card} showLink={false} className="space-y-4" />
          <ContractTermsRetakeTable />
        </div>
      </section>
    </div>
  );
}
