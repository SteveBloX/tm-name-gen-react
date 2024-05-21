import { Divider, Drawer } from "antd";
import SavedUsernameView from "./savedUsernameView";

function SavedUsernamesDrawer({
  open,
  setOpen,
  onLoad,
  messageApi,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLoad: (id: string) => void;
  messageApi: any;
}) {
  function getAllLocalStorage() {
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }

    return values
      .filter((item) => item && item.includes("username_"))
      .map((item) => JSON.parse(item || "{}"));
  }
  let savedUsernames = getAllLocalStorage();

  function onDelete(id: string) {
    localStorage.removeItem(id);
    messageApi.success("Username deleted");
    setOpen(false);
  }

  return (
    <Drawer
      title="Saved Usernames"
      placement="right"
      closable={true}
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <ul>
        {savedUsernames.map((item, i) => (
          <>
            <SavedUsernameView
              id={item.id}
              onDelete={onDelete}
              onLoad={onLoad}
              key={item.id}
            />
            {i === savedUsernames.length - 1 ? null : <Divider />}
          </>
        ))}
      </ul>
    </Drawer>
  );
}

export default SavedUsernamesDrawer;
