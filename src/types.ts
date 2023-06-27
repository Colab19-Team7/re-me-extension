export type CurrentTab = {
  image?: string | null;
  title?: string;
  url?: string;
  favIconUrl?: string;
};

export type MessageOptions = {
  type: any;
  title: string;
  message: string;
  iconUrl: any;
  silent: boolean;
};

export type NotificationMessage = {
  message: MessageOptions;
  item_url: string;
};
