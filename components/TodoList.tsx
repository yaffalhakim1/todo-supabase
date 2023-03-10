import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import {
  Button,
  Center,
  Checkbox,
  Flex,
  Input,
  List,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

type Todos = Database["public"]["Tables"]["todos"]["Row"];

export default function Todos({ session }: { session: Session }) {
  const supabase = useSupabaseClient();
  const [todos, setTodos] = useState<Todos[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [errorText, setErrorText] = useState("");

  const user = session.user;

  useEffect(() => {
    const fetchTodos = async () => {
      let { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .order("id", { ascending: true });
      if (error) console.log("error", error);
      else setTodos(todos!);
    };
  }, []);

  const addTodo = async (taskText: string) => {
    let task = taskText.trim();
    if (task.length) {
      const { data: todo, error } = await supabase
        .from("todos")
        .insert({ task, user_id: user.id })
        .select()
        .single();
      if (error) setErrorText(error.message);
      else {
        setTodos([...todos, todo]);
        setNewTaskText("");
      }
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await supabase.from("todos").delete().eq("id", id).throwOnError();
      setTodos(todos.filter((x: any) => x.id != id));
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <Center>
        {" "}
        <Text fontSize="4xl" mt={10} mx="auto">
          TodoList
        </Text>
      </Center>

      <Flex>
        <Input
          mt={2}
          type="text"
          placeholder="make coffee"
          value={newTaskText}
          onChange={(e) => {
            setErrorText("");
            setNewTaskText(e.target.value);
          }}
        />

        <Button
          ml={2}
          mt={2}
          onClick={() => addTodo(newTaskText)}
          colorScheme="green"
        >
          Add
        </Button>
      </Flex>
      {!!errorText && toast.error("failed to add new todo")}
      <List mt={4} spacing={5}>
        {todos.map((todo: any) => (
          <Todo
            key={todo.id}
            todo={todo}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </List>
    </div>
  );
}

const Todo = ({ todo, onDelete }: { todo: Todos; onDelete: () => void }) => {
  const supabase = useSupabaseClient<Database>();
  const [isCompleted, setIsCompleted] = useState(todo.is_complete);

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ is_complete: !isCompleted })
        .eq("id", todo.id)
        .throwOnError()
        .select()
        .single();
      if (data) {
        setIsCompleted(data.is_complete);
        toast.success("todo updated");
      }
      if (error) console.log("error", error);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ListItem
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
    >
      <Flex>
        {/* <Text>{todo.task} </Text> */}

        <Checkbox
          isChecked={isCompleted ? true : false}
          ml={2}
          colorScheme="green"
          onChange={(e) => {
            e.preventDefault();
            toggle();
          }}
        >
          {todo.task}
        </Checkbox>
        <Button
          ml="auto"
          colorScheme={"red"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
            toast.success("todo deleted");
          }}
        >
          <DeleteIcon />
        </Button>
      </Flex>
    </ListItem>
  );
};
