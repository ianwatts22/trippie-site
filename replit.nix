{ pkgs }: {
  deps = [
    pkgs.nodejs-16_x
    pkgs.run dev
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}