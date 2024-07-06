let navigation = [
  {
    name: "My Playlists",
    to: "/MyPlaylists",
    current: false,
  },
  { name: "Public Playlists", to: "/PublicPlaylists", current: false },
  { name: "About", to: "/About", current: false },
];

const updateNavigation = () => {
  if (localStorage.getItem("token")) {
    navigation.unshift({ name: "Profile", to: "/Profile", current: false });
  } else {
    navigation = [
      {
        name: "My Playlists",
        to: "/MyPlaylists",
        current: false,
      },
      { name: "Public Playlists", to: "/PublicPlaylists", current: false },
      { name: "About", to: "/About", current: false },
    ];
  }
};

export { navigation, updateNavigation };
