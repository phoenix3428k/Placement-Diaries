"use server";

export async function updateUserAlias(alias: string) {
  try {
    return {
      success: true,
      message: `Alias updated to ${alias}`,
    };
  } catch {
    return {
      success: false,
      message: "Failed to update alias",
    };
  }
}

export async function regenerateAlias() {
  try {
    const aliases = [
      "SilentWolf",
      "MidnightCoder",
      "ShadowPhoenix",
      "HiddenTiger",
      "DarkFalcon",
    ];

    const alias =
      aliases[Math.floor(Math.random() * aliases.length)];

    return {
      success: true,
      alias,
      message: "Alias regenerated",
    };
  } catch {
    return {
      success: false,
      message: "Failed to regenerate alias",
    };
  }
}