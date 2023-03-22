export default function getArg(args: any[], name: string, defaultValue: any) {
	return args.find((arg) => arg.name === name)?.value ?? defaultValue;
}
