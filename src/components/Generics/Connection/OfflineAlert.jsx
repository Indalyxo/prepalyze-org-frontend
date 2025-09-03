import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Group, Text } from "@mantine/core";
import { IconWifiOff, IconWifi, IconRefresh } from "@tabler/icons-react";
import classes from "./offline-alert.module.scss";

export default function OfflineAlert({
  pingUrl,
  position = "top",
  closable = true,
  autoHideAfterOnlineMs = 1500,
  showRetry = true,
  retryTimeoutMs = 4000,
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const hideTimerRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Clear any existing timers
  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (retryTimeoutRef.current) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const current = typeof navigator !== "undefined" ? navigator.onLine : true;
    setIsOnline(current);
    setVisible(!current);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      clearTimers();
      setIsOnline(true);
      setRetrying(false); // Stop any ongoing retry
      
      if (autoHideAfterOnlineMs === 0) {
        setVisible(false);
      } else {
        hideTimerRef.current = window.setTimeout(() => {
          setVisible(false);
          hideTimerRef.current = null;
        }, autoHideAfterOnlineMs);
      }
    };

    const handleOffline = () => {
      clearTimers();
      setIsOnline(false);
      setVisible(true);
      setRetrying(false); // Stop any ongoing retry
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimers();
    };
  }, [autoHideAfterOnlineMs, clearTimers]);

  const endpoint = useMemo(() => pingUrl || "/", [pingUrl]);

  const pingConnectivity = useCallback(async () => {
    // Prevent multiple simultaneous retries
    if (retrying) return;
    
    setRetrying(true);
    clearTimers(); // Clear any auto-hide timers
    
    try {
      const controller = new AbortController();
      
      // Set timeout for the request
      retryTimeoutRef.current = window.setTimeout(() => {
        controller.abort();
      }, retryTimeoutMs);

      // Try HEAD request first, fallback to GET
      let response;
      try {
        response = await fetch(endpoint, {
          method: "HEAD",
          cache: "no-store",
          signal: controller.signal,
        });
      } catch (headError) {
        // If HEAD fails, try GET
        response = await fetch(endpoint, {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "text/plain" },
          signal: controller.signal,
        });
      }

      // Clear the timeout since request completed
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Check if response is successful (2xx status codes)
      if (response && response.ok) {
        // Connection is working
        setIsOnline(true);
        
        if (autoHideAfterOnlineMs === 0) {
          setVisible(false);
        } else {
          hideTimerRef.current = window.setTimeout(() => {
            setVisible(false);
            hideTimerRef.current = null;
          }, autoHideAfterOnlineMs);
        }
      } else {
        // Server responded but with error status
        setIsOnline(false);
        setVisible(true);
      }
    } catch (error) {
      // Network error, timeout, or aborted request
      console.log('Connection check failed:', error.name);
      setIsOnline(false);
      setVisible(true);
    } finally {
      setRetrying(false);
      // Clear timeout if still active
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    }
  }, [endpoint, autoHideAfterOnlineMs, retryTimeoutMs, retrying, clearTimers]);

  // Don't render if online and not visible
  if (isOnline && !visible) return null;

  return (
    <div
      className={`${classes.container} ${
        position === "top" ? classes.top : classes.bottom
      }`}
      aria-live="assertive"
      aria-atomic="true"
      role="status"
    >
      <div className={classes.slideIn}>
        <Alert
          color={isOnline ? "green" : "red"}
          variant="filled"
          radius="md"
          withCloseButton={closable}
          onClose={() => setVisible(false)}
          icon={
            isOnline ? (
              <IconWifi size={18} aria-hidden="true" />
            ) : (
              <IconWifiOff size={18} aria-hidden="true" />
            )
          }
          className={classes.alert}
          title={isOnline ? "Back online" : "You are offline"}
        >
          <Group justify="space-between" wrap="nowrap" gap="md" align="center">
            <div className={classes.textWrap}>
              {!isOnline ? (
                <Text size="sm" className={classes.muted}>
                  Some features may not work. We'll reconnect automatically
                  when your internet is back.
                </Text>
              ) : (
                <Text size="sm" className={classes.muted}>
                  Connection restored.
                </Text>
              )}
            </div>

            {!isOnline && showRetry && (
              <Button
                size="xs"
                variant="white"
                color="dark"
                leftSection={<IconRefresh size={14} aria-hidden="true" />}
                loading={retrying}
                onClick={pingConnectivity}
                aria-label="Retry connection check"
                disabled={retrying}
              >
                Retry
              </Button>
            )}
          </Group>
        </Alert>
      </div>
    </div>
  );
}