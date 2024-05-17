/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import { Button, Forms, Toasts } from "@vencord/types/webpack/common";

import { SettingsComponent } from "./Settings";

export const VencordLocationPicker: SettingsComponent = ({ settings }) => {
    return (
        <>
            <Forms.FormText>
                Vencordファイルは{" "}
                {settings.vencordDir ? (
                    <a
                        href="about:blank"
                        onClick={e => {
                            e.preventDefault();
                            VesktopNative.fileManager.showItemInFolder(settings.vencordDir!);
                        }}
                    >
                        {settings.vencordDir}
                    </a>
                ) : (
                    "デフォルトの場所"
                )}
                からロードされています。
            </Forms.FormText>
            <div className="vcd-location-btns">
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={async () => {
                        const choice = await VesktopNative.fileManager.selectVencordDir();
                        switch (choice) {
                            case "cancelled":
                                return;
                            case "invalid":
                                Toasts.show({
                                    message:
                                        "有効なVencordインストールのディレクトリを選択していません。distフォルダを選択してください。",
                                    id: Toasts.genId(),
                                    type: Toasts.Type.FAILURE
                                });
                                return;
                        }
                        settings.vencordDir = choice;
                    }}
                >
                    Change
                </Button>
                <Button
                    size={Button.Sizes.SMALL}
                    color={Button.Colors.RED}
                    onClick={() => (settings.vencordDir = void 0)}
                >
                    リセット
                </Button>
            </div>
        </>
    );
};
