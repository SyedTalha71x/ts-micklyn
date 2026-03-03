import { useEffect, useState } from "react";
import { ChevronRight, Loader, LogOut, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FireApi, handleLogout } from "@/hooks/fireApi";
import { useProfile } from "@/Context/ProfileContext";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const SecurityPrivacy = () => {
  const { t } = useTranslation('settings');
  const { profile, setProfile, handleUserProfile } = useProfile();
  const [hideBalance, setHideBalance] = useState(false);
  const [disableMFA, setDisableMFA] = useState(false);
  const [isLoadingDeactivate, setIsLoadingDeactivate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.user?.mfa !== undefined) {
      setDisableMFA(profile.user.mfa === 1);
    }
  }, [profile]);

  const handleMultifactorAuthentication = async (checked) => {
    try {
      const res = await FireApi(`/multi-factor-auth/${checked}`, "PATCH");
      setProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          mfa: checked ? 1 : 0,
        },
      }));

      setDisableMFA(checked);
      handleUserProfile();
      toast.success(res.message || t('security.mfaUpdated'));
    } catch (error) {
      toast.error(error.message || t('security.mfaFailed'));
    }
  };

  const handleDeactivateAccount = async () => {
    setIsLoadingDeactivate(true);
    try {
      const res = await FireApi("/deactivate", "POST");
      toast.success(res.message || t('security.accountDeactivated'));
      handleUserProfile();
      setActionCompleted(true);
      setActionType("deactivate");

      // Logout user after 3 seconds
      setTimeout(() => {
        handleLogout();
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.message || t('security.deactivateFailed'));
    } finally {
      setIsLoadingDeactivate(false);
      setShowDeactivateModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoadingDelete(true);
    try {
      const res = await FireApi("/delete", "DELETE");
      toast.success(res.message || t('security.accountDeleted'));
      handleUserProfile();
      setActionCompleted(true);
      setActionType("delete");

      // Logout user after 3 seconds
      setTimeout(() => {
        handleLogout();
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.message || t('security.deleteFailed'));
    } finally {
      setIsLoadingDelete(false);
      setShowDeleteModal(false);
    }
  };

  const ConfirmationModal = ({
    isOpen,
    onClose,
    title,
    description,
    confirmText,
    onConfirm,
    isLoading,
    isDeactivate = false,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold dark:text-white">{title}</h3>

          <div className="mt-4 space-y-3">
            <p className="text-gray-600 dark:text-gray-300">{description}</p>

            {isDeactivate && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <LogOut className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {t('security.modal.deactivateWarning', { email: t('security.contactSupport') })}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="dark:bg-gray-700 dark:text-white"
            >
              {t('security.modal.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-black cursor-pointer hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isLoading ? (
                <Loader className="animate-spin mr-2" size={16} />
              ) : null}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-2 manrope-font text-sm">
      <h2 className="text-lg manrope-font dark:text-white">
        {t('security.safeGuard')}
      </h2>

      <div className="space-y-4">
        {/* <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors">
          <span className="dark:text-white">{t('security.lockMethod')}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Card> */}

        <Card
          onClick={() => navigate("/settings/change-password")}
          className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors"
        >
          <span className="dark:text-white">{t('security.changePassword')}</span>
          <div className="flex items-center">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-base manrope-font dark:text-white">
          {t('security.authentication')}
        </h3>
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors">
          <span className="dark:text-white">{t('security.multifactorAuth')}</span>
          <div className="flex items-center">
            <Switch
              checked={disableMFA}
              onCheckedChange={(checked) =>
                handleMultifactorAuthentication(checked)
              }
            />
          </div>
        </Card>
      </div>

      <div
        className="space-y-2 mt-4"
        onClick={() => navigate("/settings/transaction-password")}
      >
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors">
          <span className="dark:text-white">{t('security.transactionPassword')}</span>
          <div className="flex items-center">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-base manrope-font dark:text-white">
          {t('security.privacy')}
        </h3>
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors">
          <span className="dark:text-white">{t('security.hideBalance')}</span>
          <Switch checked={hideBalance} onCheckedChange={setHideBalance} />
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-base manrope-font dark:text-white">
          {t('security.walletBackups')}
        </h3>
        <Card
          onClick={() => navigate("/settings/wallet-backup")}
          className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors"
        >
          <span className="text-primary dark:text-white">
            {t('security.walletNeedsBackup', { count: 1 })}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Card>
         <Card
          onClick={() => navigate("/settings/backup-all-wallet")}
          className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors"
        >
          <span className="text-primary dark:text-white">
            {t('security.backupAllWallets')}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Card>
      </div>

      {/* Action confirmation cards */}
      <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors mt-8">
        <span className="text-primary dark:text-white">
          {t('security.deactivateAccount')}
        </span>
        <Button
          onClick={() => setShowDeactivateModal(true)}
          className="bg-black text-white hover:bg-black/70 h-8 text-xs cursor-pointer w-32"
          variant="destructive"
        >
          {t('security.deactivate')}
        </Button>
      </Card>

      <Card className="p-4 flex flex-row justify-between items-center cursor-pointer transition-colors mt-4">
        <span className="text-primary dark:text-white">
          {t('security.deleteAccount')}
        </span>
        <Button
          onClick={() => setShowDeleteModal(true)}
          className="bg-black text-white hover:bg-black/70 h-8 text-xs cursor-pointer w-32"
          variant="destructive"
        >
          {t('security.delete')}
        </Button>
      </Card>

      {/* Success message after action */}
      {actionCompleted && (
        <Card className="p-4 mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium dark:text-white">
                {actionType === "deactivate"
                  ? t('security.deactivationSuccess')
                  : t('security.deletionSuccess')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {actionType === "deactivate" ? (
                  <>
                    {t('security.deactivationMessage')}{" "}
                    <span className="text-blue-500 dark:text-blue-400">
                      {t('security.contactSupport')}
                    </span>
                  </>
                ) : (
                  <>
                    {t('security.deletionMessage')}{" "}
                    <span className="text-blue-500 dark:text-blue-400">
                      {t('security.contactSupport')}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Deactivate Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title={t('security.modal.deactivateTitle')}
        description={t('security.modal.deactivateDescription')}
        confirmText={t('security.modal.confirmDeactivate')}
        onConfirm={handleDeactivateAccount}
        isLoading={isLoadingDeactivate}
        isDeactivate={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('security.modal.deleteTitle')}
        description={t('security.modal.deleteDescription')}
        confirmText={t('security.modal.confirmDelete')}
        onConfirm={handleDeleteAccount}
        isLoading={isLoadingDelete}
      />
    </div>
  );
};

export default SecurityPrivacy;