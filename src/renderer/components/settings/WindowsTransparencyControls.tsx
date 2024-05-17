/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import { Margins } from "@vencord/types/utils";
import { Forms, Select } from "@vencord/types/webpack/common";

import { SettingsComponent } from "./Settings";

export const WindowsTransparencyControls: SettingsComponent = ({ settings }) => {
    if (!VesktopNative.app.supportsWindowsTransparency()) return null;

    return (
        <>
            <Forms.FormTitle className={Margins.top16 + " " + Margins.bottom8}>
                ウインドウの透かしの設定
            </Forms.FormTitle>
            <Forms.FormText className={Margins.bottom8}>
                完全な再起動が必要です。これを使用するには、対応したテーマを使用する必要があります。
            </Forms.FormText>

            <Select
                placeholder="None"
                options={[
                    {
                        label: "None",
                        value: "none",
                        default: true
                    },
                    {
                        label: "Mica (システムテーマ＋デスクトップ壁紙を組み込み、背景を彩る",
                        value: "mica"
                    },
                    { label: "Tabbed (背景の色合いが強いマイカの変種)", value: "tabbed" },
                    {
                        label: "Acrylic (Vesktopの背後にあるウィンドウをぼかし、背景を半透明にする。)",
                        value: "acrylic"
                    }
                ]}
                closeOnSelect={true}
                select={v => (settings.transparencyOption = v)}
                isSelected={v => v === settings.transparencyOption}
                serialize={s => s}
            />

            <Forms.FormDivider className={Margins.top16 + " " + Margins.bottom16} />
        </>
    );
};
