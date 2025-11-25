import { ProviderType } from "@/lib/generated/prisma/enums";
import GFGPage from "./gfg";
import LeetcodePage from "./leetcode";

const Providers = ({ providerType }: { providerType: ProviderType }) => {
	let Component = null;
	console.log(providerType, ProviderType, "jgjgjkgkgkgkj")
	switch(providerType){
		case ProviderType.LEETCODE:
			Component = LeetcodePage;
			break;
		case ProviderType.GFG:
			Component = GFGPage;
			break;
		default:
			break;
	}
	console.log(Component,' COMPONENT')
	return Component ? <Component /> : null;
};

export default Providers;
