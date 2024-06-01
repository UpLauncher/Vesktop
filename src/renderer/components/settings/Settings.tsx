/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import "./settings.css";

import { Forms, Switch, Text } from "@vencord/types/webpack/common";
import { ComponentType } from "react";
import { Settings, useSettings } from "renderer/settings";
import { isMac, isWindows } from "renderer/utils";

import { AutoStartToggle } from "./AutoStartToggle";
import { DiscordBranchPicker } from "./DiscordBranchPicker";
import { NotificationBadgeToggle } from "./NotificationBadgeToggle";
import { VencordLocationPicker } from "./VencordLocationPicker";
import { WindowsTransparencyControls } from "./WindowsTransparencyControls";

interface BooleanSetting {
    key: keyof typeof Settings.store;
    title: string;
    description: string;
    defaultValue: boolean;
    disabled?(): boolean;
    invisible?(): boolean;
}

export type SettingsComponent = ComponentType<{ settings: typeof Settings.store }>;

const SettingsOptions: Record<string, Array<BooleanSetting | SettingsComponent>> = {
    Discordのブランチ: [DiscordBranchPicker],
    システムの起動とパフォーマンス: [
        AutoStartToggle,
        {
            key: "hardwareAcceleration",
            title: "ハードウェアアクセラレーション",
            description: "ハードウェアアクセラレーションを有効にします。",
            defaultValue: true
        }
    ],
    ユーザーインターフェース: [
        {
            key: "customTitleBar",
            title: "Discordのタイトルバー",
            description: "Discordのカスタムタイトルバーの代わりに、システムの標準タイトルバーを使用します。",
            defaultValue: isWindows
        },
        {
            key: "staticTitle",
            title: "静的なタイトル",
            description: 'ウィンドウのタイトルを現在のページに変更するのではなく、"Vesktop"にする。',
            defaultValue: false
        },
        {
            key: "enableMenu",
            title: "メニューバーを有効にする",
            description: "アプリケーションのメニューバーを有効にします。Altキーで切り替えれます。",
            defaultValue: false,
            disabled: () => Settings.store.customTitleBar ?? isWindows
        },
        {
            key: "splashTheming",
            title: "スプラッシュ画面のテーマ",
            description: "スプラッシュ画面の色をカスタムテーマに合わせます。",
            defaultValue: false
        },
        WindowsTransparencyControls
    ],
    見た目: [
        {
            key: "tray",
            title: "トレイアイコン",
            description: "Vesktopのトレイアイコンを追加します。",
            defaultValue: true,
            invisible: () => isMac
        },
        {
            key: "minimizeToTray",
            title: "トレイに最小化",
            description: "Vesktopのウインドウを閉じるボタンを押した時に、トレイに移動します。",
            defaultValue: true,
            invisible: () => isMac,
            disabled: () => Settings.store.tray === false
        },
        {
            key: "clickTrayToShowHide",
            title: "非表示/表示をトレイで切り替える",
            description: "トレイアイコンをクリックすると、非表示/表示をトレイで切り替えれます。",
            defaultValue: false
        },
        {
            key: "disableMinSize",
            title: "ウインドウの最小サイズを無効にする",
            description: "Discordのウインドウ最小サイズを無効にします。",
            defaultValue: false
        },
        {
            key: "disableSmoothScroll",
            title: "なめらかなスクロールを無効にする",
            description: "なめらかなスクロールを無効にします。",
            defaultValue: false
        }
    ],
    通知とアップデート: [
        NotificationBadgeToggle,
        {
            key: "checkUpdates",
            title: "アップデートを確認する",
            description: "自動的にVesktopのアップデートを確認します。",
            defaultValue: true
        }
    ],
    その他: [
        {
            key: "arRPC",
            title: "アクティビティ",
            description: "arRPCを使用したアクティビティを有効にします。",
            defaultValue: false
        },

        {
            key: "openLinksWithElectron",
            title: "アプリでリンクを開く (実験中)",
            description: "あなたのウェブブラウザの代わりにVesktopでリンクを開きます。",
            defaultValue: false
        }
    ],
    VencordJPの場所: [VencordLocationPicker]
};

function SettingsSections() {
    const Settings = useSettings();

    const sections = Object.entries(SettingsOptions).map(([title, settings]) => (
        <Forms.FormSection
            title={title}
            key={title}
            className="vcd-settings-section"
            titleClassName="vcd-settings-title"
        >
            {settings.map(Setting => {
                if (typeof Setting === "function") return <Setting settings={Settings} />;

                const { defaultValue, title, description, key, disabled, invisible } = Setting;
                if (invisible?.()) return null;

                return (
                    <Switch
                        value={Settings[key as any] ?? defaultValue}
                        onChange={v => (Settings[key as any] = v)}
                        note={description}
                        disabled={disabled?.()}
                        key={key}
                    >
                        {title}
                    </Switch>
                );
            })}
        </Forms.FormSection>
    ));

    return <>{sections}</>;
}

export default function SettingsUi() {
    return (
        <Forms.FormSection>
            <Text variant="heading-lg/semibold" style={{ color: "var(--header-primary)" }} tag="h2">
                VesktopJPの設定
            </Text>

            <SettingsSections />
        </Forms.FormSection>
    );
}
