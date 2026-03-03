import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Portfolio = () => {
  const { t } = useTranslation('settings');
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-2 manrope-font text-sm">
      <h2 className="text-lg manrope-font dark:text-white">
        {t('portfolio.title')}
      </h2>

      <div
        className="space-y-4"
        onClick={() => navigate("/settings/transactions")}
      >
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors">
          <span className="dark:text-white">{t('portfolio.allTransactions')}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Card>
      </div>

      <div onClick={() => navigate("/settings/copy-trades")}>
        <Card className="mt-4 p-4 flex flex-row justify-between items-center cursor-pointer transition-colors">
          <span className="dark:text-white">{t('portfolio.copyTrades')}</span>
          <div className="flex items-center">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <div
        className="space-y-2 mt-4"
        onClick={() => navigate("/settings/limit-orders")}
      >
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors">
          <span className="dark:text-white">{t('portfolio.limitOrder')}</span>
          <div className="flex items-center">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;